<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            //security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_PRO') and object.getUser() == user",
            uriTemplate: '/users/{userId}/notifications',
            uriVariables: [
                'userId' => new Link(fromClass: User::class, toProperty: 'user'),
            ],
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Put(
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Patch(
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
        ),
    ],
    security: "is_granted('ROLE_ADMIN')"
)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $message = null;

    #[ORM\ManyToOne(inversedBy: 'notification')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: 'boolean')]
    #[ORM\JoinColumn(nullable: false)]
    private ?bool $isRead = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

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

    public function getIsRead(): ?bool
    {
        return $this->isRead;
    }

    public function setIsRead(bool $isRead): static
    {
        $this->isRead = $isRead;

        return $this;
    }
}
