<?php
namespace App\Controller;

use App\Entity\Companie;
use App\Entity\User;
use App\Services\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

class CompanieController extends AbstractController
{
    #[Route('/api/companies', name: 'create_companie', methods: ['POST'])]
    public function __invoke(Request $request, FileUploader $fileUploader, EntityManagerInterface $em, LoggerInterface $logger): Response
    {
        $companie = new Companie();
        $companie->setName($request->request->get('name'));
        $companie->setAddress($request->request->get('address'));
        $companie->setZipCode((int) $request->request->get('zipCode'));
        $companie->setCity($request->request->get('city'));
        $companie->setCreatedAt(new \DateTimeImmutable());

        if ($request->files->get('kbis')) {
            $kbisFilename = $fileUploader->upload($request->files->get('kbis'));
            $companie->setKbis($kbisFilename);
        }

        $userId = $request->request->get('userId');
        $logger->info('User Object:' . $userId);
        if ($userId) {
            $user = $em->getRepository(User::class)->find($userId);
            $logger->info('User Object:', ['user' => $user ? $user->getId() : 'Not Found']);
            if ($user) {
                $companie->addUser($user);
            }
        }

        $em->persist($companie);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'data'   => 'Companie created successfully.',
        ]);
    }
}
