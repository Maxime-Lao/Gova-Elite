<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ForgotPasswordSendEmailController extends AbstractController
{
    private $entityManager;
    private $passwordEncoder;
    private $mailer;
    private  $userRepository;


    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordEncoder,
        UserPasswordHasher $mailer,
        UserRepository $userRepository,
    )
    {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->mailer = $mailer;
        $this->userRepository = $userRepository;
    }

    public function __invoke(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        if (!$email) {
            return new Response('Email requis !', Response::HTTP_BAD_REQUEST);
        }
        $user = $this->userRepository->findOneByEmail($email);
        $token = bin2hex(random_bytes(32));
        $user->setPasswordResetToken($token);
        $this->entityManager->flush();
        $this->mailer->sendVerificationEmail($user);

        return new Response('Email envoyé !', Response::HTTP_OK);
    }
}