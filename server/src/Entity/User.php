<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $firstname = null;

    #[ORM\Column(length: 100)]
    private ?string $lastname = null;

    #[ORM\Column(length: 100)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(length: 15)]
    private ?string $phone = null;

    #[ORM\Column(nullable: true)]
    private ?bool $isVerified = null;

    #[ORM\OneToMany(mappedBy: 'userr', targetEntity: Notice::class)]
    private Collection $notices;

    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?Role $role = null;

    #[ORM\OneToMany(mappedBy: 'userr', targetEntity: Notification::class)]
    private Collection $notification;

    #[ORM\OneToMany(mappedBy: 'userr', targetEntity: Media::class)]
    private Collection $media;

    public function __construct()
    {
        $this->notices = new ArrayCollection();
        $this->notification = new ArrayCollection();
        $this->media = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function isIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(?bool $isVerified): static
    {
        $this->isVerified = $isVerified;

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
            $notice->setUserr($this);
        }

        return $this;
    }

    public function removeNotice(Notice $notice): static
    {
        if ($this->notices->removeElement($notice)) {
            // set the owning side to null (unless already changed)
            if ($notice->getUserr() === $this) {
                $notice->setUserr(null);
            }
        }

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): static
    {
        $this->role = $role;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotification(): Collection
    {
        return $this->notification;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notification->contains($notification)) {
            $this->notification->add($notification);
            $notification->setUserr($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notification->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUserr() === $this) {
                $notification->setUserr(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): static
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
            $medium->setUserr($this);
        }

        return $this;
    }

    public function removeMedium(Media $medium): static
    {
        if ($this->media->removeElement($medium)) {
            // set the owning side to null (unless already changed)
            if ($medium->getUserr() === $this) {
                $medium->setUserr(null);
            }
        }

        return $this;
    }
}
