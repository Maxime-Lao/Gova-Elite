<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use App\Entity\User;
use App\Entity\Role;
use App\Entity\MediaObject;
use App\Entity\Companie;
use App\Entity\Car;
use App\Entity\Brand;
use App\Entity\Model;
use App\Entity\Energy;
use App\Entity\Gear;
use App\Entity\Category;
use App\Entity\Notice;
use App\Entity\Reason;
use App\Entity\Rent;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $roles = [];
        $roleNames = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_PRO'];
        foreach ($roleNames as $name) {
            $role = new Role();
            $role->setName($name);
            $manager->persist($role);
            $roles[] = $role;
        }

        $users = [];
        for ($i = 0; $i < 20; $i++) {
            $user = new User();
            $user->setEmail($faker->email);
            $randomRole = $roles[array_rand($roles)];
            $user->setRoles([$randomRole->getName()]);
            $user->setPassword($faker->password);
            $user->setIsVerified($faker->boolean);
            $user->setFirstname($faker->firstName);
            $user->setLastname($faker->lastName);
            $user->setPhone($faker->phoneNumber);
            $user->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($user);
            $users[] = $user;
        }

        $companies = [];
        for ($i = 0; $i < 5; $i++) {
            $companie = new Companie();
            $companie->setName($faker->company);
            $companie->setAddress($faker->address);
            $companie->setZipCode((int)$faker->postcode);
            $companie->setCity($faker->city);
            $companie->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($companie);
            $companies[] = $companie;
        }

        $brandNames = ['Audi', 'BMW', 'Mercedes', 'Tesla', 'Toyota'];
        $brands = [];
        foreach ($brandNames as $name) {
            $brand = new Brand();
            $brand->setName($name);
            $brand->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($brand);
            $brands[] = $brand;
        }

        $modelNames = ['A4', 'X5', 'C-Class', 'Model S', 'Corolla'];
        $models = [];
        foreach ($brands as $index => $brand) {
            $model = new Model();
            $model->setName($modelNames[$index]);
            $model->setBrand($brand);
            $model->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($model);
            $models[] = $model;
        }

        $energies = [];
        foreach (['Diesel', 'Essence', 'Électrique', 'Hybride'] as $energyName) {
            $energy = new Energy();
            $energy->setName($energyName);
            $energy->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($energy);
            $energies[] = $energy;
        }

        $gears = [];
        foreach (['Manuelle', 'Automatique'] as $gearName) {
            $gear = new Gear();
            $gear->setName($gearName);
            $gear->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($gear);
            $gears[] = $gear;
        }

        $categories = [];
        foreach (['SUV', 'Break', 'Coupé', 'Berline'] as $catLibelle) {
            $category = new Category();
            $category->setLibelle($catLibelle);
            $manager->persist($category);
            $categories[] = $category;
        }

        $cars = [];
        for ($i = 0; $i < 20; $i++) {
            $car = new Car();
            $car->setDescription('Voiture de haute qualité avec toutes les fonctionnalités modernes.');
            $car->setYear($faker->numberBetween(2015, 2021));
            $car->setHorses($faker->numberBetween(150, 400));
            $car->setNbSeats($faker->numberBetween(2, 7));
            $car->setNbDoors($faker->numberBetween(3, 5));
            $car->setPrice($faker->numberBetween(10, 25));
            $car->setMileage($faker->numberBetween(10000, 100000));
            $car->setGear($faker->randomElement($gears));
            $car->setModel($faker->randomElement($models));
            $car->setEnergy($faker->randomElement($energies));
            $category = $faker->randomElement($categories);
            $car->setCategory($category);
            $car->setCompanie($faker->randomElement($companies));
            $car->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));

            $manager->persist($car);
            $cars[] = $car;
        }

        for ($i = 0; $i < 20; $i++) {
            $media = new MediaObject();
            $media->setUser($faker->randomElement($users));
            $media->setCar($faker->randomElement($cars));
            $media->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $manager->persist($media);
        }

        for ($i = 0; $i < 15; $i++) {
            $notice = new Notice();
            $notice->setMessage($faker->sentence);
            $notice->setNbStars($faker->numberBetween(1, 5));
            $notice->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
            $notice->setCompanie($faker->randomElement($companies));
            $notice->setUser($faker->randomElement($users));
            $manager->persist($notice);
        }

        $manager->flush();
    }
}
