<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @Route("/api/users/by-email/{email}", name="get_user_by_email", methods={"GET"})
     */
    public function getUserByEmail(string $email): JsonResponse
    {
        $user = $this->userRepository->findOneByEmail($email);

        if ($user === null) {
            // L'utilisateur n'a pas été trouvé
            return $this->json(['message' => 'User not found'], 404);
        }


        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }


}
