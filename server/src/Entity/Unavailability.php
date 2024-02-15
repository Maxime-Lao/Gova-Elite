<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use App\Repository\UnavailabilityRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: UnavailabilityRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_PRO')", securityMessage: "Only Muthu can create categories."),
        new Put(security: "is_granted('ROLE_PRO')", securityMessage: "Only Muthu can update categories."),
        new Patch(security: "is_granted('ROLE_PRO')", securityMessage: "Only Muthu can modify categories."),
        new Delete(security: "is_granted('ROLE_PRO')", securityMessage: "Only Muthu can delete categories.")
    ]
)]
class Unavailability
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'car:read', 'comments_user:read', 'rents_companie:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'La raison ne peut pas être vide')]
    #[Groups(['car:read'])]
    private ?string $reason = null;

    #[ORM\Column]
    #[Groups(['car:read', 'rents_user:read'])]
    private ?\DateTimeImmutable $date_start = null;

    #[ORM\Column]
    #[Groups(['car:read', 'rents_user:read'])]
    private ?\DateTimeImmutable $date_end = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive(message: 'Le prix doit être un nombre positif')]
    #[Groups(['car:read'])]
    private ?int $price = null;

    #[ORM\ManyToOne(inversedBy: 'unavailabilities')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_companie:read'])]
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
        $this->reason = ucfirst(trim($reason));

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
