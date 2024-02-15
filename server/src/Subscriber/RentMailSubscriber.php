<?php

namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Rent;
use App\Entity\Notification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Doctrine\ORM\EntityManagerInterface;

final class RentMailSubscriber implements EventSubscriberInterface
{
    private $mailer;
    private $em;

    public function __construct(MailerInterface $mailer, EntityManagerInterface $em)
    {
        $this->mailer = $mailer;
        $this->em = $em;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendMailandNotification', EventPriorities::POST_WRITE],
        ];
    }

    public function sendMailandNotification(ViewEvent $event): void
    {
        $rent = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$rent instanceof Rent || Request::METHOD_POST !== $method) {
            return;
        }

        $pro = $rent->getCompanie()->getUsers()->get(0);

        $message = (new Email())
            ->from('mmo@kanieba.com')
            ->to($pro->getEmail())
            ->subject('Une nouvelle réservation a été effectuée')
            ->html('<p>Une nouvelle réservation a été effectuée pour la voiture ' . $rent->getCar()->getModel()->getName() . ' du ' . $rent->getDateStart()->format('d/m/Y') . ' au ' . $rent->getDateEnd()->format('d/m/Y') . '</p>');

        $this->mailer->send($message);

        $notification = new Notification();
        $notification->setUser($pro);
        $notification->setMessage('Une nouvelle réservation a été effectuée pour la voiture ' . $rent->getCar()->getModel()->getName());
        $this->em->persist($notification);
        $this->em->flush();
    }
}