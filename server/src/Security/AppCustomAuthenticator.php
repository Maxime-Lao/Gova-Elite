<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\HttpFoundation\JsonResponse;


class AppCustomAuthenticator extends AbstractLoginFormAuthenticator
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = 'api_login';

    public function __construct(UrlGeneratorInterface $urlGenerator, UserProviderInterface $userRepository)
    {
        $this->urlGenerator = $urlGenerator;
        $this->userRepository = $userRepository;
    }

    public function authenticate(Request $request): Passport
    {
        $email = $request->request->get('email', '');

        $user = $this->userRepository->loadUserByIdentifier($email);

        if (!$user instanceof User) {
            throw new CustomUserMessageAuthenticationException('Email not found.');
        }

        $request->getSession()->set(Security::LAST_USERNAME, $email);

        return new Passport(
            new UserBadge($email, function () use ($user) {
                return $user;
            }),
            new PasswordCredentials($request->request->get('password', '')),
            [
                new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token')),
            ]
        );
    }
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();

        // Vérifiez si l'utilisateur est null ou ne possède pas la méthode isVerified
        if ($user === null || !method_exists($user, 'isVerified')) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé ou méthode isVerified non disponible.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        if (!$user->isVerified()) {
            // L'utilisateur n'est pas vérifié
            return new JsonResponse(['error' => 'Votre email n\'a pas été vérifié.'], JsonResponse::HTTP_FORBIDDEN);
        }

        // L'utilisateur est vérifié, vous pouvez rediriger
        if ($targetPath = $this->getTargetPath($request->getSession(), $firewallName)) {
            return new JsonResponse(['redirect' => $targetPath]);
        }

        return new JsonResponse(['redirect' => $this->urlGenerator->generate('front_default_index')]);
    }

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }
}
