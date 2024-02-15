<?php

namespace App\State;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

final class UserPasswordHasher implements ProcessorInterface
{
    private MailerInterface $mailer;

    public function __construct(
        private readonly ProcessorInterface $processor,
        private readonly UserPasswordHasherInterface $passwordHasher,
        MailerInterface $mailer,
        UrlGeneratorInterface $router,
        EntityManagerInterface $entityManager
    )
    {
        $this->mailer = $mailer;
        $this->router = $router;
        $this->entityManager = $entityManager;
    }

    private function sendWelcomeEmail(User $user)
    {
        $verificationUrl = $this->router->generate(
            'user_verify',
            ['token' =>  $user->getToken()],
            UrlGeneratorInterface::ABSOLUTE_URL);

        $currentEmail = (new Email())
            ->from('mmo@kanieba.com')
            ->to($user->getEmail())
            ->subject('Bienvenue sur La Gova !')
            ->text('')
            ->html("<p>Please verify your account by clicking <a href=\"{$verificationUrl}\">here</a>.</p>");

        $this->mailer->send($currentEmail);
    }
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof User && $data->getPlainPassword()) {
            // Vérifie si l'utilisateur tente de s'attribuer le rôle admin
            if (in_array('ROLE_ADMIN', $data->getRoles())) {
                throw new UnprocessableEntityHttpException('Only this person can create admin user : https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            }

            $validRoles = ['ROLE_USER', 'ROLE_PRO'];
            $submittedRoles = $data->getRoles();
            $filteredRoles = array_intersect($submittedRoles, $validRoles);

            // Vérifie si tous les rôles soumis sont valides
            if (count($submittedRoles) > count($filteredRoles)) {
                throw new UnprocessableEntityHttpException('One or more submitted roles do not exist.');
            }
            
            // Assurez-vous qu'il y a toujours au moins le rôle ROLE_USER si aucun autre rôle valide n'est fourni
            if (empty($filteredRoles)) {
                $filteredRoles = ['ROLE_USER'];
            }

            // Mise à jour des rôles de l'utilisateur avec seulement ceux autorisés
            $data->setRoles($filteredRoles);

            // La logique pour hasher le mot de passe et envoyer l'email reste inchangée
            $hashedPassword = $this->passwordHasher->hashPassword($data, $data->getPlainPassword());
            $data->setPassword($hashedPassword);
            $data->eraseCredentials();

            if ($operation->getMethod() === 'POST') {
                $verificationToken = bin2hex(random_bytes(32));
                $data->setToken($verificationToken);
                $this->sendWelcomeEmail($data);
            }
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
    public function sendVerificationEmail(User $user)
    {
        $verificationUrl = $this->router->generate(
            'user_verify',
            ['token' =>  $user->getPasswordResetToken()],
            UrlGeneratorInterface::ABSOLUTE_URL);

        $currentEmail = (new Email())
            ->from('mmo@kanieba.com')
            ->to($user->getEmail())
            ->subject('Modification de mot de passe')
            ->text('')
            ->html("<p>Cliquez ici pour changer votre mot de passe <a href=\"http://195.35.29.110:3000/resetpswd/" . $user->getPasswordResetToken() . "\">ici</a>.</p>");

        $this->mailer->send($currentEmail);
    }

}