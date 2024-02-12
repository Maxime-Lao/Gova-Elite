<?php
namespace App\Controller;

use App\Entity\Companie;
use App\Services\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CompanieController extends AbstractController
{
    #[Route('/api/companies', name: 'create_companie', methods: ['POST'])]
    public function __invoke(Request $request, FileUploader $fileUploader, EntityManagerInterface $em): Response
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

        $em->persist($companie);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'data'   => 'Companie created successfully.',
        ]);
    }
}
