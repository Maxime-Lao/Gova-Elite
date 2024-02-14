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
    
        if (!is_array($data) || !isset($data['email']) || empty($data['email'])) {
            return new Response('Email requis !', Response::HTTP_BAD_REQUEST);
        }
    
        $email = $data['email'];
    
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new Response('Email invalide !', Response::HTTP_BAD_REQUEST);
        }
    
        $user = $this->userRepository->findOneByEmail($email);
    
        if (!$user) {
            return new Response('Utilisateur non trouvé !', Response::HTTP_NOT_FOUND);
        }
    
        $token = bin2hex(random_bytes(32));
    
        $user->setPasswordResetToken($token);
        $this->entityManager->flush();
    
        try {
            $this->mailer->sendVerificationEmail($user);
        } catch (\Exception $e) {
            return new Response('Erreur lors de l\'envoi de l\'email !', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return new Response('Email envoyé !', Response::HTTP_OK);
    }
    
}