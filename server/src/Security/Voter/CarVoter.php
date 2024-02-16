<?php
namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use App\Entity\Car;
use App\Entity\User;
use Symfony\Component\Security\Core\User\UserInterface;

class CarVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['EDIT', 'DELETE'])
            && $subject instanceof Car;
    }

    protected function voteOnAttribute(string $attribute, mixed $car, TokenInterface $token): bool
    {
        if (!$car instanceof Car) {
            return false;
        }

        $user = $token->getUser();
        if (!$user instanceof UserInterface || !$user instanceof User) {
            return false;
        }

        $userCompanie = $user->getCompanie();

        if (null === $userCompanie) {
            return false;
        }

        foreach ($userCompanie->getCars() as $userCar) {
            if ($userCar->getId() === $car->getId()) {
                return true; 
            }
        }

        return false;
    }
}
