<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
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
                    [
                        'name' => 'model',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                    [
                        'name' => 'category',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                    [
                        'name' => 'energy',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                    [
                        'name' => 'gear_type',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                    [
                        'name' => 'brand',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                    [
                        'name' => 'nb_seats',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'integer',
                        ],
                    ],
                    [
                        'name' => 'nb_doors',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'integer',
                        ],
                    ],
                    [
                        'name' => 'price',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'number',
                        ],
                    ],
                    [
                        'name' => 'horses',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'integer',
                        ],
                    ],
                    [
                        'name' => 'mileage',
                        'in' => 'query',
                        'required' => false,
                        'schema' => [
                            'type' => 'integer',
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
    #[Assert\DateTime(format: 'd/m/Y')]
    public string $endDate = '';

    #[Assert\NotBlank]
    public string $location = '';

    //optional parameters
    public ?array $category = [];
    public ?array $energy = [];
    public ?array $gear_type = [];
    public ?array $brand = [];
    public ?int $nb_seats = 0;
    public ?int $nb_doors = 0;
    public ?float $price = 0.0;
    public ?int $horses = 0;
    public ?int $mileage = 0;

    public function __construct(string $startDate = '', string $endDate = '', string $location = '')
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->location = $location;
    }

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

    public function getCategory(): ?array
    {
        return $this->category;
    }

    public function setCategory(?array $category): void
    {
        $this->category = $category;
    }

    public function getEnergy(): ?array
    {
        return $this->energy;
    }

    public function setEnergy(?array $energy): void
    {
        $this->energy = $energy;
    }

    public function getGearType(): ?array
    {
        return $this->gear_type;
    }

    public function setGearType(?array $gear_type): void
    {
        $this->gear_type = $gear_type;
    }

    public function getBrand(): ?array
    {
        return $this->brand;
    }

    public function setBrand(?array $brand): void
    {
        $this->brand = $brand;
    }

    public function getNbSeats(): ?int
    {
        return $this->nb_seats;
    }

    public function setNbSeats(?int $nb_seats): void
    {
        $this->nb_seats = $nb_seats;
    }

    public function getNbDoors(): ?int
    {
        return $this->nb_doors;
    }

    public function setNbDoors(?int $nb_doors): void
    {
        $this->nb_doors = $nb_doors;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): void
    {
        $this->price = $price;
    }

    public function getHorses(): ?int
    {
        return $this->horses;
    }

    public function setHorses(?int $horses): void
    {
        $this->horses = $horses;
    }
    
    public function getMileage(): ?int
    {
        return $this->mileage;
    }

    public function setMileage(?int $mileage): void
    {
        $this->mileage = $mileage;
    }

    public function getFilters(): array
    {
        return [
            'category' => $this->category,
            'energy' => $this->energy,
            'gear_type' => $this->gear_type,
            'brand' => $this->brand,
            'nb_seats' => $this->nb_seats,
            'nb_doors' => $this->nb_doors,
            'price' => $this->price,
            'horses' => $this->horses,
            'mileage' => $this->mileage,
        ];
    }

    public function setFilters(array $filters): void
    {
        $this->category = $filters['category'];
        $this->energy = $filters['energy'];
        $this->gear_type = $filters['gear_type'];
        $this->brand = $filters['brand'];
        $this->nb_seats = $filters['nb_seats'];
        $this->nb_doors = $filters['nb_doors'];
        $this->price = $filters['price'];
        $this->horses = $filters['horses'];
        $this->mileage = $filters['mileage'];
    }

    public function getSearchCriteria(): array
    {
        return [
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'location' => $this->location,
        ];
    }

    public function setSearchCriteria(array $searchCriteria): void
    {
        $this->startDate = $searchCriteria['startDate'];
        $this->endDate = $searchCriteria['endDate'];
        $this->location = $searchCriteria['location'];
    }

    public function getSearchParameters(): array
    {
        return array_merge($this->getSearchCriteria(), $this->getFilters());
    }
}
