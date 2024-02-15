<?php 
namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class PreventRoleChangeSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['checkRoleModification', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function checkRoleModification(ViewEvent $event)
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        $request = $event->getRequest();

        if (!$user instanceof User || Request::METHOD_PATCH !== $method) {
            return;
        }

        $requestData = json_decode($request->getContent(), true);

        if (isset($requestData['roles']) && !$this->security->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedHttpException('Seuls les administrateurs peuvent modifier les rôles des utilisateurs.');
        }
    }

}
