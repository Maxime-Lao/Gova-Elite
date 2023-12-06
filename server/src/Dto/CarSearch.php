<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use App\Controller\CarSearchController;
use App\Entity\Car;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/cars/search',
            controller: CarSearchController::class,
            read: false,
            openapiContext: [
                'summary' => 'Search for available cars',
                'description' => 'Search for available cars for a given date range and location',
                'parameters' => [
                    [
                        'name' => 'startDate',
                        'in' => 'query',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'format' => 'date',
                        ],
                    ],
                    [
                        'name' => 'endDate',
                        'in' => 'query',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'format' => 'date',
                        ],
                    ],
                    [
                        'name' => 'location',
                        'in' => 'query',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                        ],
                    ],
                ],
            ],
            output: [
                'class' => Car::class,
                'collection' => true,
            ],
        ),
    ]
)]

class CarSearch
{
    #[Assert\NotBlank]
    #[Assert\DateTime(format: 'd/m/Y')]
    public string $startDate = '';

    #[Assert\NotBlank]
    #[Assert\GreaterThan(propertyPath: 'startDate')]
    #[Assert\DateTime(format: 'd/m/Y')]
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
