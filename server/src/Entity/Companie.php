<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CompanieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CompanieRepository::class)]
#[ApiResource]
class Companie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom de la companie ne peut pas être vide')]
    #[Groups(['car:read', 'car_search:read', 'comment:read', 'user:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'L\'adresse ne peut pas être vide')]
    #[Groups(['car_search:read', 'user:read'])]
    private ?string $address = null;

    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: User::class, orphanRemoval: true)]
    private Collection $users;

    #[ORM\Column]
    #[Assert\Type(type: 'integer', message: 'Le code postal doit être un nombre entier')]
    #[Assert\Length(
        min: 5,
        max: 10,
        minMessage: 'Le code postal doit avoir au moins 5 chiffres',
        maxMessage: 'Le code postal ne peut pas dépasser 10 chiffres'
    )]
    #[Groups(['car_search:read', 'user:read'])]
    private ?string $zipCode = null;

    #[ORM\Column(length: 100)]
    #[Groups(['car_search:read', 'user:read'])]
    private ?string $city = null;

    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: Car::class)]
    #[Groups(['user:read'])]
    private Collection $cars;

    #[ORM\OneToMany(mappedBy: 'companie', targetEntity: Notice::class)]
    #[Groups(['user:read'])]
    private Collection $notices;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;
    #[Groups(['user:read'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->cars = new ArrayCollection();
        $this->notices = new ArrayCollection();
        $this->users = new ArrayCollection();
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
        $this->name = $name;

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



    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }

    public function setZipCode(string $zipCode): static
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
        $this->city = $city;

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
     * @return Collection<int, Notice>
     */
    public function getNotices(): Collection
    {
        return $this->notices;
    }

    public function addNotice(Notice $notice): static
    {
        if (!$this->notices->contains($notice)) {
            $this->notices->add($notice);
            $notice->setCompanie($this);
        }

        return $this;
    }

    public function removeNotice(Notice $notice): static
    {
        if ($this->notices->removeElement($notice)) {
            // set the owning side to null (unless already changed)
            if ($notice->getCompanie() === $this) {
                $notice->setCompanie(null);
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
            // set the owning side to null (unless already changed)
            if ($user->getCompanie() === $this) {
                $user->setCompagnie(null);
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
}
