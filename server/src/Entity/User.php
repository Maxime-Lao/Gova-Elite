<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ApiFilter(SearchFilter::class, properties: ['email' => 'exact'])]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]

#[ApiResource(
    operations: [
        new GetCollection(
            //security: "is_granted('ROLE_ADMIN')",
            normalizationContext: ['groups' => ['user:read']],
        ),
        new Post(
            processor: UserPasswordHasher::class,
            validationContext: ['groups' => ['Default', 'user:create']]
        ),
        new Get(
            //security: "is_granted('ROLE_ADMIN')",
            normalizationContext: ['groups' => ['user:read']],
        ),
        new Put(
            uriTemplate: '/users/{id}',
            processor: UserPasswordHasher::class,
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Only authenticated users can modify users."
        ),
        new Patch(
            uriTemplate: '/users/{id}',
            processor: UserPasswordHasher::class,
            //security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Only authenticated users can modify users."
        ),
        new Delete(
            uriTemplate: '/users/{id}',
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Only authenticated users can delete users."
        ),
    ],
    normalizationContext: [
        'groups' => ['user:read'],
        'enable_max_depth' => true,
    ],    denormalizationContext: ['groups' => ['user:create', 'user:update']],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups('user:read')]
    private ?Companie $companie = null;

    #[Assert\NotBlank(message: 'L\'adresse e-mail ne peut pas être vide')]
    #[Assert\Email(message: 'L\'adresse e-mail doit être valide')]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Les rôles ne peuvent pas être vides')]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank(message: 'Le mot de passe ne peut pas être vide')]
    #[Assert\Length(
        min: 8,
        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères'
    )]
    #[Groups(['user:create'])]
    #[Assert\Regex(
        pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
        message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'
    )]
    private ?string $password = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read', 'user:create'])]
    private ?bool $isVerified = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank(message: 'Le prénom ne peut pas être vide')]
    #[Groups(['user:read', 'user:create', 'user:update', 'comments_car:read', 'rents:read', 'comments:read', 'rents_companie:read'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank(message: 'Le nom ne peut pas être vide')]
    #[Groups(['user:read', 'user:create', 'user:update', 'comments_car:read', 'rents:read', 'comments:read', 'rents_companie:read'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank(message: 'Le numéro de téléphone ne peut pas être vide')]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?string $phone = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $token = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $passwordResetToken = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read'])]
    private ?bool $isValidKbis = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Rent::class, orphanRemoval: true)]
    #[Groups('user:read')]
    private Collection $rents;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Comment::class, orphanRemoval: true)]
    #[Groups('user:read', 'comments_car:read')]
    private Collection $comments;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MediaObject::class, orphanRemoval: true)]
    #[Groups('user:read')]
    private Collection $media;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Notice::class, orphanRemoval: true)]
    #[Groups('user:read')]
    private Collection $notices;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:create', 'user:update','user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:create', 'user:update','user:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getPasswordResetToken(): ?string
    {
        return $this->passwordResetToken;
    }

    public function setPasswordResetToken(?string $passwordResetToken): static
    {
        $this->passwordResetToken = $passwordResetToken;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = strtolower($email);

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getIsValidKbis(): ?bool
    {
        return $this->isValidKbis;
    }

    public function setIsValidKbis(?bool $isValidKbis): static
    {
        $this->isValidKbis = $isValidKbis;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    /**
     * @return Collection|Rent[]
     */
    public function getRents(): Collection
    {
        return $this->rents;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

/**
     * @return Collection<int, MediaObject[]>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    /**
     * @return Collection<int, Notice[]>
     */
    public function getNotices(): Collection
    {
        return $this->notices;
    }

    public function getCompanie(): ?Companie
    {
        return $this->companie;
    }

    public function setCompagnie(?Companie $companie): static
    {
        $this->companie = $companie;

        return $this;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setAuthor($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            if ($comment->getAuthor() === $this) {
                $comment->setAuthor(null);
            }
        }
        return $this;
    }

    public function addMedia(MediaObject $media): static
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setUser($this);
        }

        return $this;
    }

    public function removeMedia(MediaObject $media): static
    {
        if ($this->media->removeElement($media)) {
            if ($media->getUser() === $this) {
                $media->setUser(null);
            }
        }

        return $this;
    }

    public function addNotice(Notice $notice): static
    {
        if (!$this->notices->contains($notice)) {
            $this->notices->add($notice);
            $notice->setUser($this);
        }
        return $this;
    }

    public function removeNotice(Notice $notice): static
    {
        if ($this->notices->removeElement($notice)) {
            if ($notice->getUser() === $this) {
                $notice->setUser(null);
            }
        }
        return $this;
    }

    public function setLastname(?string $lastname): static
    {
        $this->lastname = $lastname;

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

    public function getVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }
    
    public function setMedia(?MediaObject $media): self {
        if ($media === null && $this->media !== null) {
            $this->media->setUser(null);
        }
    
        if ($media !== null && $media->getUser() !== $this) {
            $media->setUser($this);
        }
    
        $this->media = $media;
    
        return $this;
    }
}