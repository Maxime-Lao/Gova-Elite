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
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use App\Entity\Notification;

class CompanieController extends AbstractController
{
    #[Route('/api/companies', name: 'create_companie', methods: ['POST'])]
    public function __invoke(Request $request, FileUploader $fileUploader, EntityManagerInterface $em, LoggerInterface $logger, MailerInterface $mailer, UrlGeneratorInterface $urlGenerator): Response
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

        $adminUsers = $em->getRepository(User::class)->findByRole('ROLE_ADMIN');

        $kbisPath = $request->files->get('kbis') ? $fileUploader->getTargetDirectory().'/'.$companie->getKbis() : null;

        foreach ($adminUsers as $adminUser) {
            $email = (new Email())
                ->from('mmo@kanieba.com')
                ->to($adminUser->getEmail())
                ->subject('Une nouvelle entreprise a été créée')
                ->html("<p>Une nouvelle entreprise a été créée. Veuillez vérifier les détails.</p>");

            if ($kbisPath) {
                $email->attachFromPath($kbisPath, 'Document Kbis');
            }

            $mailer->send($email);
        }

        foreach ($adminUsers as $adminUser) {
            $notification = new Notification();
    
            $message = 'Une nouvelle entreprise a été créée. ';
            if ($kbisPath) {
                $kbisName = $companie->getKbis();
                $message .= "Document Kbis disponible ici: http://195.35.29.110:8000/public/uploads/kbis/" . $kbisName;
            }
    
            $notification->setMessage($message);
            $notification->setUser($adminUser); 
    
            $em->persist($notification);
        }
    
        $em->flush();

        return $this->json([
            'status' => 'success',
            'data'   => 'Companie created successfully.',
        ]);
    }
}
