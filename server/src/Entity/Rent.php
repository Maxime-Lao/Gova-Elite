<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Repository\RentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RentRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['rents:read']])]
#[ApiResource(
    uriTemplate: '/cars/{carId}/rents',
    uriVariables: [
        'carId' => new Link(fromClass: Car::class, toProperty: 'car'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['rents_car:read']],
)]
#[ApiResource(
    uriTemplate: '/users/{userId}/rents',
    uriVariables: [
        'userId' => new Link(fromClass: User::class, toProperty: 'user'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['rents_user:read']],
)]
#[ApiResource(
    uriTemplate: '/companies/{companieId}/rents',
    uriVariables: [
        'companieId' => new Link(fromClass: Companie::class, toProperty: 'companie'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['rents_companie:read']],
)]
class Rent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'car:read', 'comments_user:read', 'rents_companie:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotBlank(message: 'La date de début de la réservation ne peut pas être vide')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'car:read', 'user:read', 'rents_companie:read'])]
    private ?\DateTimeImmutable $dateStart = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotBlank(message: 'La date de fin de la réservation ne peut pas être vide')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'car:read', 'user:read', 'rents_companie:read'])]

    private ?\DateTimeImmutable $dateEnd = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le prix total ne peut pas être vide')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'rents_companie:read'])]
    private ?float $totalPrice = null;

    #[ORM\Column]
    #[Groups(['rents_car:read', 'rents_user:read', 'rents_companie:read'])]
    private ?string $paymentMethodId;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'rents_companie:read'])]
    private ?Car $car = null;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rents:read', 'rents_car:read', 'rents_user:read', 'rents_companie:read'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'rent', targetEntity: Comment::class, orphanRemoval: true)]
    #[Groups(['rents:read', 'user:read'])]
    private Collection $comments;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rents:read', 'rents_car:read'])]
    private ?Companie $companie = null;

    #[ORM\Column]
    #[Groups('rents:read')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups('rents:read')]
    private ?\DateTimeImmutable $updatedAt = null;
    
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateStart(): ?\DateTimeImmutable
    {
        return $this->dateStart;
    }

    public function setDateStart(\DateTimeImmutable $dateStart): static
    {
        $this->dateStart = $dateStart;

        return $this;
    }

    public function getDateEnd(): ?\DateTimeImmutable
    {
        return $this->dateEnd;
    }

    public function setDateEnd(\DateTimeImmutable $dateEnd): static
    {
        $this->dateEnd = $dateEnd;

        return $this;
    }

    public function getTotalPrice(): ?int
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(int $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getPaymentMethodId(): ?string
    {
        return $this->paymentMethodId;
    }

    public function setPaymentMethodId(string $paymentMethodId): static
    {
        $this->paymentMethodId = $paymentMethodId;

        return $this;
    }

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): static
    {
        $this->car = $car;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

     /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setRent($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getRent() === $this) {
                $comment->setRent(null);
            }
        }

        return $this;
    }

    public function getCompanie(): ?Companie
    {
        return $this->companie;
    }

    public function setCompanie(?Companie $companie): static
    {
        $this->companie = $companie;
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
}
