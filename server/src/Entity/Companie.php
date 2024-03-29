<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\CompanieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\CompanieController;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CompanieRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['companies:read']]
        ),
        new Get(),
        new Put(
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Patch(
            uriTemplate: '/companies/{id}',
            normalizationContext: ['groups' => ['companies:update']],
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Post(
            security: "is_granted('ROLE_PRO')",
            controller: CompanieController::class,
            deserialize: false
        )
    ]
)]

class Companie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['companies:read', 'user:read', 'connected:read', 'car:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom de la companie ne peut pas être vide')]
    #[Groups(['companies:read', 'car:read', 'car_search:read', 'comments_car:read', 'user:read', 'rents_user:read', 'rents:read', 'comments:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'L\'adresse ne peut pas être vide')]
    #[Groups(['companies:read', 'car_search:read', 'user:read'])]
    private ?string $address = null;

    #[Groups(['companies:read', 'car:read'])]
    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: User::class, orphanRemoval: true)]
    private Collection $users;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le code postal ne peut pas être vide')]
    #[Assert\Length(
        min: 5,
        max: 10,
        minMessage: 'Le code postal doit avoir au moins 5 chiffres',
        maxMessage: 'Le code postal ne peut pas dépasser 10 chiffres'
    )]
    #[Groups(['companies:read', 'car_search:read', 'user:read'])]
    private ?int $zipCode = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'La ville ne peut pas être vide')]
    #[Groups(['companies:read', 'car_search:read', 'user:read'])]
    private ?string $city = null;

    #[ORM\Column(nullable: false)]
    #[Groups(['companies:read', 'user:read'])]
    private bool $isVerified = false;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['companies:read'])]
    private ?string $kbis = null;

    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: Car::class, orphanRemoval: true)]
    #[Groups(['companies:read', 'user:read'])]
    private Collection $cars;

    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: Rent::class, orphanRemoval: true)]
    #[Groups(['companies:read', 'user:read'])]
    private Collection $rents;


    #[ORM\Column]
    #[Groups(['companies:read', 'user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['companies:read', 'user:read'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->cars = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->rents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = ucfirst(trim($name));

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;
        return $this;
    }



    public function getZipCode(): ?int
    {
        return $this->zipCode;
    }

    public function setZipCode(int $zipCode): static
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = ucfirst(trim($city));

        return $this;
    }

    public function getIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getKbis(): ?string
    {
        return $this->kbis;
    }

    public function setKbis(?string $kbis): self
    {
        $this->kbis = $kbis;

        return $this;
    }

    /**
     * @return Collection<int, Car>
     */
    public function getCars(): Collection
    {
        return $this->cars;
    }

    public function addCar(Car $car): static
    {
        if (!$this->cars->contains($car)) {
            $this->cars->add($car);
            $car->setCompanie($this);
        }

        return $this;
    }

    public function removeCar(Car $car): static
    {
        if ($this->cars->removeElement($car)) {
            // set the owning side to null (unless already changed)
            if ($car->getCompanie() === $this) {
                $car->setCompanie(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setCompagnie($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->cars->removeElement($user)) {
            if ($user->getCompanie() === $this) {
                $user->setCompagnie(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Rent>
     */
    public function getRents(): Collection
    {
        return $this->rents;
    }

    public function addRent(Rent $rent): static
    {
        if (!$this->rents->contains($rent)) {
            $this->rents->add($rent);
            $rent->setCompanie($this);
        }

        return $this;
    }

    public function removeRents(Rent $rent): static
    {
        if ($this->rents->removeElement($rent)) {
            if ($rent->getCompanie() === $this) {
                $rent->setCompanie(null);
            }
        }

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

    public function getKbisUrl(): ?string
    {
        return $this->kbis ? sprintf('/uploads/kbis/%s', $this->kbis) : null;
    }
}
