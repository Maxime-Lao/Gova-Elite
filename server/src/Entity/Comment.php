<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CommentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CommentRepository::class)]
#[ApiResource()]
#[ApiResource(
    uriTemplate: '/cars/{carId}/comments',
    uriVariables: [
        'carId' => new Link(fromClass: Car::class, toProperty: 'car'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['comments_car:read']],
)]
#[ApiResource(
    uriTemplate: '/users/{userId}/comments',
    uriVariables: [
        'userId' => new Link(fromClass: User::class, toProperty: 'author'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['comments_user:read']],
)]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['comments_car:read', 'comments_user:read', 'car:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note de propreté ne peut pas être vide')]
    #[Assert\Positive(message: 'La note de propreté doit être un égal à zéro')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $cleanliness = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note de maintenance ne peut pas être vide')]
    #[Assert\Positive(message: 'La note de maintenance doit être un nombre positif')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $maintenance = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note de communication ne peut pas être vide')]
    #[Assert\Positive(message: 'La note de communication doit être un nombre positif')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $communication = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note de commodité ne peut pas être vide')]
    #[Assert\Positive(message: 'La note de commodité doit être un nombre positif')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $convenience = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note de précision ne peut pas être vide')]
    #[Assert\Positive(message: 'La note de précision doit être un nombre positif')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $accuracy = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La note globale ne peut pas être vide')]
    #[Assert\Positive(message: 'La note globale doit être un nombre positif')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?float $globalRating = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le commentaire ne peut pas être vide')]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?string $comment = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['comments_user', 'car:read'])]
    private ?Rent $rent = null;

    #[ORM\Column]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['comments_car:read', 'car:read'])]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['car:read', 'comments_user:read'])]
    private ?Car $car;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCleanliness(): ?float
    {
        return $this->cleanliness;
    }

    public function setCleanliness(float $cleanliness): static
    {
        $this->cleanliness = $cleanliness;
        return $this;
    }

    public function getMaintenance(): ?float
    {
        return $this->maintenance;
    }

    public function setMaintenance(float $maintenance): static
    {
        $this->maintenance = $maintenance;

        return $this;
    }

    public function getCommunication(): ?float
    {
        return $this->communication;
    }

    public function setCommunication(float $communication): static
    {
        $this->communication = $communication;

        return $this;
    }

    public function getConvenience(): ?float
    {
        return $this->convenience;
    }

    public function setConvenience(float $convenience): static
    {
        $this->convenience = $convenience;

        return $this;
    }

    public function getAccuracy(): ?float
    {
        return $this->accuracy;
    }

    public function setAccuracy(float $accuracy): static
    {
        $this->accuracy = $accuracy;

        return $this;
    }

    public function getGlobalRating(): ?float
    {
        return $this->globalRating;
    }

    public function setGlobalRating(float $globalRating): static
    {
        $this->globalRating = $globalRating;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getRent(): ?Rent
    {
        return $this->rent;
    }
    
    public function setRent(?Rent $rent): static
    {
        $this->rent = $rent;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;
        return $this;
    }

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): self
    {
        $this->car = $car;

        return $this;
    }
}
