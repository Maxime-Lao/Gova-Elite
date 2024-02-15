<?php
namespace App\Controller;

use App\Entity\Companie;
use App\Entity\User;
use App\Entity\Notification;
use App\Services\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class CompanieController extends AbstractController
{
    #[Route('/api/companies', name: 'create_companie', methods: ['POST'])]
    public function __invoke(Request $request, FileUploader $fileUploader, EntityManagerInterface $em, LoggerInterface $logger, MailerInterface $mailer): Response
    {
        $userId = $request->request->get('userId');
        if ($userId) {
            $user = $em->getRepository(User::class)->find($userId);
        }

        if ($user->getRoles() == ["ROLE_PRO"]) {
            if ($user->getCompanie() != []) {
                throw new HttpException(400, "Cet utilisateur possède déjà une compagnie.");
            }
        }

        $requiredFields = ['name', 'address', 'zipCode', 'city'];
        foreach ($requiredFields as $field) {
            if (!$request->request->get($field)) {
                return $this->json(['status' => 'error', 'message' => "Missing $field"], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $kbisFile = $request->files->get('kbis');
        if (!$kbisFile) {
            return $this->json(['status' => 'error', 'message' => 'Missing kbis file'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $maxSize = 5 * 1024 * 1024;
        $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if ($kbisFile->getSize() > $maxSize || !in_array($kbisFile->getMimeType(), $allowedTypes)) {
            return $this->json(['status' => 'error', 'message' => 'Invalid file. Only PDF, JPG, PNG files are allowed and size must be less than 5MB.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $companie = new Companie();
        $companie->setName($request->request->get('name'))
                 ->setAddress($request->request->get('address'))
                 ->setZipCode((int) $request->request->get('zipCode'))
                 ->setCity($request->request->get('city'))
                 ->setCreatedAt(new \DateTimeImmutable());

        $kbisFilename = $fileUploader->upload($request->files->get('kbis'));
        $companie->setKbis($kbisFilename);

        if ($user) {
            $companie->addUser($user);
        }
        

        $em->persist($companie);
        $em->flush();

        $adminUsers = $em->getRepository(User::class)->findByRole('ROLE_ADMIN');
        $kbisPath = $fileUploader->getTargetDirectory() . '/' . $companie->getKbis();

        foreach ($adminUsers as $adminUser) {
            $email = (new Email())
                ->from('mmo@kanieba.com')
                ->to($adminUser->getEmail())
                ->subject('Une nouvelle entreprise a été créée')
                ->html("<p>Une nouvelle entreprise a été créée. Veuillez vérifier les détails.</p>")
                ->attachFromPath($kbisPath, 'Document Kbis');

            $mailer->send($email);

            $notification = new Notification();
            $message = 'Une nouvelle entreprise a été créée. Document Kbis disponible ici: ' . $request->getSchemeAndHttpHost() . "/public/uploads/kbis/" . $companie->getKbis();
            $notification->setMessage($message)
                          ->setUser($adminUser);

            $em->persist($notification);
        }

        $em->flush();

        return $this->json([
            'status' => 'success',
            'data'   => 'Companie created successfully.',
        ]);
    }
}
