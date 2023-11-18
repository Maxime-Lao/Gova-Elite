<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Services\MailerService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterController extends AbstractController
{
    private $mailer;

    public function __construct(MailerService $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route(path: '/api/register', name: 'api_register', methods: ['POST'] )]
    public function register(Request $request, UserPasswordHasherInterface $passwordEncoder, EntityManagerInterface $entityManager): Response
    {
        $requestData = json_decode($request->getContent(), true);

        $email = $requestData['email'];
        $plainPassword = $requestData['password'];
        $firstname = $requestData['firstname'];
        $lastname = $requestData['lastname'];
        $phone = $requestData['phone'];

        $user = new User();
        $user->setEmail($email);
        $user->setFirstname($firstname);
        $user->setLastname($lastname);
        $user->setPhone($phone);

        $user->setPassword($passwordEncoder->hashPassword(
            $user,
            $plainPassword
        ));

        $entityManager->persist($user);
        $entityManager->flush();

        $this->mailer->sendMail($email);

        return new Response('Utilisateur enregistré avec succès',Response::HTTP_OK);
    }
}