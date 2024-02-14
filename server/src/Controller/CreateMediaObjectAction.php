<?php
// api/src/Controller/CreateMediaObjectAction.php

namespace App\Controller;

use App\Entity\MediaObject;
use App\Entity\Car;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $em): MediaObject
    {
        $uploadedFile = $request->files->get('file');
        $carId = $request->request->get('car_id');
        $userId = $request->request->get('user_id');

        // Récupérez l'entité Car et User en fonction de leurs ID
        $car = $em->getRepository(Car::class)->find($carId);
        $user = $em->getRepository(User::class)->find($userId);

        if (!$car || !$user) {
            throw new BadRequestHttpException('Invalid car_id or user_id');
        }

        $mediaObject = new MediaObject();
        $mediaObject->file = $uploadedFile;
        $mediaObject->setCar($car);
        $mediaObject->setUser($user);

        return $mediaObject;
    }
}
