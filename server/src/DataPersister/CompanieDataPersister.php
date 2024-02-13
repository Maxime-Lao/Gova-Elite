<?php 
namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\Companie;
use App\Services\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class CompanieDataPersister implements ContextAwareDataPersisterInterface
{
    private $entityManager;
    private $fileUploader;
    private $requestStack;

    public function __construct(EntityManagerInterface $entityManager, FileUploader $fileUploader, RequestStack $requestStack)
    {
        $this->entityManager = $entityManager;
        $this->fileUploader = $fileUploader;
        $this->requestStack = $requestStack;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof Companie;
    }

    public function persist($data, array $context = [])
    {
        $request = $this->requestStack->getCurrentRequest();
        if ($request && $kbisFile = $request->files->get('kbis')) {
            $kbisFilename = $this->fileUploader->upload($kbisFile);
            $data->setKbis($kbisFilename);
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }

    public function remove($data, array $context = [])
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
