<?php

namespace App\Controller;

use App\Entity\Car;
use App\Entity\Rent;
use App\Repository\CarRepository;
use App\Repository\RentRepository;
use App\Dto\CarSearch;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CarSearchController extends AbstractController
{
    public function __construct(
        private CarRepository $carRepository,
        private RentRepository $rentRepository
    ) {
    }

    public function __invoke(CarSearch $dto)
    {
        $rents = $this->rentRepository->findByLocationAndDate(
            $dto->getLocation(),
            $dto->getStartDate(),
            $dto->getEndDate()
        );

        $cars = [];

        foreach ($rents as $rent) {
            $cars[] = $rent->getCar();
        }

        return $cars;

    }
}

