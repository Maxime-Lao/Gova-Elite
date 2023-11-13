<?php

namespace App\Dto;

use App\Entity\Car;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Controller\CarSearchController;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(
            name: 'CarSearch',
            uriTemplate: '/cars/search',
            controller: CarSearchController::class,
            output: Car::class,
        ),
    ],
)]
class CarSearch
{
    #[Assert\NotBlank]
    public string $startDate = '';

    #[Assert\NotBlank]
    public string $endDate = '';

    #[Assert\NotBlank]
    public string $location = '';

    public function getStartDate(): string
    {
        return $this->startDate;
    }

    public function setStartDate(string $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function getEndDate(): string
    {
        return $this->endDate;
    }

    public function setEndDate(string $endDate): void
    {
        $this->endDate = $endDate;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function setLocation(string $location): void
    {
        $this->location = $location;
    }
}





