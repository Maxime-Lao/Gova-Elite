<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UnavailabilityRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: UnavailabilityRepository::class)]
#[ApiResource]
#[ApiResource(
    uriTemplate: '/cars/{carId}/unavailabilities',
    uriVariables: [
        'carId' => new Link(fromClass: Car::class, toProperty: 'car'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['car:read']],
)]
class Unavailability
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'car:read', 'comments_user:read', 'rents_companie:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['car:read'])]
    private ?string $reason = null;

    #[ORM\Column]
    #[Groups(['car:read'])]
    private ?\DateTimeImmutable $date_start = null;

    #[ORM\Column]
    #[Groups(['car:read'])]
    private ?\DateTimeImmutable $date_end = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['car:read'])]
    private ?int $price = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilities')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'rents_companie:read'])]
    private ?Car $car = null;

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): static
    {
        $this->car = $car;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): static
    {
        $this->reason = $reason;

        return $this;
    }

    public function getDateStart(): ?\DateTimeImmutable
    {
        return $this->date_start;
    }

    public function setDateStart(\DateTimeImmutable $date_start): static
    {
        $this->date_start = $date_start;

        return $this;
    }

    public function getDateEnd(): ?\DateTimeImmutable
    {
        return $this->date_end;
    }

    public function setDateEnd(\DateTimeImmutable $date_end): static
    {
        $this->date_end = $date_end;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): static
    {
        $this->price = $price;

        return $this;
    }
}
