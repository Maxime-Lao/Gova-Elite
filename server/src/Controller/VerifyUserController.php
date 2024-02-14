<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class VerifyUserController extends AbstractController
{
    private $params;
    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }
    #[Route('/verify/{token}', name: 'user_verify', methods: ['GET'])]
    public function __invoke(string $token, EntityManagerInterface $em): RedirectResponse
    {
        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);
        if ($user) {
            $user->setIsVerified(true);
            $user->setToken('');
            $em->flush();
            return new RedirectResponse($_ENV['FRONT_SERVER'] . 'login');
        }

        return new RedirectResponse($_ENV['FRONT_SERVER']);
    }
}
