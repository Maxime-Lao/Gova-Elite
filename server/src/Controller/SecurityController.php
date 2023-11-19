<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{

    public function __construct()
    {
    }

    #[Route(path: 'api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordEncoder): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        $email = $requestData['email'];
        $plainPassword = $requestData['password'];

        // Chercher l'utilisateur par son email
        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user instanceof User) {
            // Comparer les mots de passe
            if ($passwordEncoder->isPasswordValid($user, $plainPassword)) {
                // Mot de passe correct, connexion réussie
                return new JsonResponse(['message' => 'Connexion réussie']);
            } else {
                // Mot de passe incorrect
                return new JsonResponse(['error' => 'Mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
            }
        } else {
            // Utilisateur non trouvé
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

/*    #[Route(path: '/forgotten-password', name: 'app_forgotten_password')]
    public function forgottenPassword(Request $request, UserRepository $userRepository, TokenGeneratorInterface $tokenGeneratorInterface, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(ForgotPasswordType::class);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $user = $userRepository->findOneByEmail($form->get("email")->getData());
            if($user == null){
                $this->addFlash("error", 'Une erreure est survenu');
                return $this->render('security/forgotten_password.html.twig',['form' => $form->createView()]);
            }
            $token = $tokenGeneratorInterface->generateToken();
            $user->setResetToken($token);

            $entityManager->persist($user);
            $entityManager->flush();

            $url = $this->generateUrl('app_change_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

            $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
                (new TemplatedEmail())
                    ->from(new Address('blablagirl76@gmail.com', 'AnythingBet'))
                    ->to($user->getEmail())
                    ->subject('Modification de mot de')
                    ->htmlTemplate('security/change_password.html.twig')
                    ->context([
                        'url' => $url
                    ])
            );
            $this->addFlash("success", 'Vous allez recevoir un mail !');
            return $this->render('security/forgotten_password.html.twig',['form' => $form->createView()]);
        }

        return $this->render('security/forgotten_password.html.twig',['form' => $form->createView()]);
    }*/

/*    #[Route(path: '/change-password/{token}', name: 'app_change_password')]
    public function changePasswd(Request $request, string $token, UserRepository $userRepository, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = $userRepository->findOneByResetToken($token);
        if($user == null){
            $this->addFlash("error", 'Jeton invalide');
            return $this->redirectToRoute("app_login");
        }
        $form = $this->createForm(ResetPasswordType::class);

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $user->setResetToken('');
            $user->setPassword(
                $passwordHasher->hashPassword(
                    $user,
                    $form->get("password")->getData()
                )
            );
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash("success", 'Votre mot de  a bien été modifié !');
            return $this->redirectToRoute("app_login");
        }else{
            //retrieve error message
            foreach ($form->getErrors(true) as $error) {
                $error = $error->getMessage();
            }
            if(isset($error)){
                $this->addFlash("error", $error);
            }
        }
        return $this->render('security/password_reset.html.twig', ["form" => $form->createView()]);
    }*/
}
