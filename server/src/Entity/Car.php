<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\CarRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CarRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['car:read']],
    //denormalizationContext: ['groups' => ['car:write']],
)]
#[ApiResource(
    uriTemplate: '/companies/{companyId}/cars',
    uriVariables: [
        'companyId' => new Link(fromClass: Companie::class, toProperty: 'companie'),
    ],
    operations: [new GetCollection()],
    normalizationContext: ['groups' => ['car_search:read']],
)]
class Car
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['car:read', 'comments_car:read', 'car_search:read', 'user:read', 'rents_user:read', 'comments_user:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'La description ne peut pas être vide')]
    #[Groups(['car:read', 'comments_car:read', 'user:read', 'rents_user:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le nombre de chevaux ne peut pas être vide')]
    #[Assert\Positive(message: 'Le nombre de chevaux doit être un nombre positif ou égal à zéro')]
    #[Groups(['car:read', 'comments_car:read', 'user:read', 'rents_user:read'])]
    private ?int $year = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le nombre de sièges ne peut pas être vide')]
    #[Assert\Positive(message: 'Le nombre de sièges doit être un nombre positif ou égal à zéro')]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?int $horses = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le prix ne peut pas être vide')]
    #[Assert\Positive(message: 'Le prix doit être un nombre positif ou égal à zéro')]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?int $nbSeats = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le kilométrage ne peut pas être vide')]
    #[Assert\Positive(message: 'Le kilométrage doit être un nombre positif ou égal à zéro')]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?int $nbDoors = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Positive]
    #[Groups(['car:read', 'car_search:read', 'user:read', 'rents_user:read'])]
    private ?float $price = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Positive]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?int $mileage = null;

    #[ORM\ManyToOne(inversedBy: 'cars')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?Gear $gear = null;

    #[ORM\ManyToOne(inversedBy: 'cars')]
    #[Groups(['car:read', 'comments_car:read', 'car_search:read', 'user:read', 'rents_user:read', 'rents:read', 'comments:read'])]
    private ?Model $model = null;

    #[ORM\ManyToOne(inversedBy: 'cars')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?Energy $energy = null;

    #[ORM\ManyToOne(inversedBy: 'cars')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['car:read', 'user:read', 'rents_user:read'])]
    private ?Category $category = null;

    #[ORM\OneToMany(mappedBy: 'car', targetEntity: MediaObject::class, orphanRemoval: true)]
    #[Groups(['car:read', 'car_search:read', 'user:read', 'rents_user:read'])]
    private Collection $media;

    #[ORM\ManyToOne(inversedBy: 'cars')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['car:read', 'comments_car:read', 'car_search:read', 'rents_user:read', 'rents:read', 'comments:read'])]
    private ?Companie $companie = null;

    #[ORM\OneToMany(mappedBy: 'car', targetEntity: Rent::class, orphanRemoval: true)]
    #[Groups(['car:read', 'user:read', 'comments_user:read'])]
    private Collection $rents;

    #[ORM\OneToMany(mappedBy: 'car', targetEntity: Comment::class, orphanRemoval: true)]
    #[Groups(['user:read'])]
    private Collection $comments;

    #[ORM\Column]
    #[Groups(['car:read', 'user:read', 'comments_user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['car:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->media = new ArrayCollection();
        $this->rents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(int $year): static
    {
        $this->year = $year;

        return $this;
    }

    public function getHorses(): ?int
    {
        return $this->horses;
    }

    public function setHorses(int $horses): static
    {
        $this->horses = $horses;

        return $this;
    }

    public function getNbSeats(): ?int
    {
        return $this->nbSeats;
    }

    public function setNbSeats(int $nbSeats): static
    {
        $this->nbSeats = $nbSeats;

        return $this;
    }

    public function getNbDoors(): ?int
    {
        return $this->nbDoors;
    }

    public function setNbDoors(int $nbDoors): static
    {
        $this->nbDoors = $nbDoors;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getMileage(): ?int
    {
        return $this->mileage;
    }

    public function setMileage(int $mileage): static
    {
        $this->mileage = $mileage;

        return $this;
    }

    public function getGear(): ?Gear
    {
        return $this->gear;
    }

    public function setGear(?Gear $gear): static
    {
        $this->gear = $gear;

        return $this;
    }

    public function getModel(): ?Model
    {
        return $this->model;
    }

    public function setModel(?Model $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getEnergy(): ?Energy
    {
        return $this->energy;
    }

    public function setEnergy(?Energy $energy): static
    {
        $this->energy = $energy;

        return $this;
    }

    public function getCategory(): ?Category {
        return $this->category;
    }

    public function setCategory(?Category $category): static {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, MediaObject>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedia(MediaObject $media): static
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setCar($this);
        }

        return $this;
    }

    public function removeMedia(MediaObject $media): static
    {
        if ($this->media->removeElement($media)) {
            if ($media->getCar() === $this) {
                $media->setCar(null);
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
            $rent->setCar($this);
        }
        return $this;
    }

    public function removeRent(Rent $rent): static
    {
        if ($this->rents->removeElement($rent)) {
            // set the owning side to null (unless already changed)
            if ($rent->getCar() === $this) {
                $rent->setCar(null);
            }
        }
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
            $comment->setCar($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getCar() === $this) {
                $comment->setCar(null);
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
