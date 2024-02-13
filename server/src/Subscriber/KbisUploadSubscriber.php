<?php
namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Companie;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Services\FileUploader;

class KbisUploadSubscriber implements EventSubscriberInterface
{
    private FileUploader $fileUploader;

    public function __construct(FileUploader $fileUploader)
    {
        $this->fileUploader = $fileUploader;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['handleKbisUpload', EventPriorities::PRE_WRITE],
        ];
    }

    public function handleKbisUpload(ViewEvent $event)
    {
        $companie = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$companie instanceof Companie || Request::METHOD_POST !== $method) {
            return;
        }

        $file = $event->getRequest()->files->get('kbis');
        if ($file) {
            $newFilename = uniqid().'.'.$file->guessExtension();
            $kbisFilename = $this->fileUploader->upload($file);
            $companie->setKbis($kbisFilename);
        }
    }
}
    