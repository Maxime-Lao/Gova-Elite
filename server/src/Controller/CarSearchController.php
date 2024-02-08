<?php

namespace App\Controller;

use App\Entity\Car;
use App\Repository\CarRepository;
use App\Repository\RentRepository;
use App\Repository\CompanieRepository;
use App\Dto\CarSearch;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsController]
class CarSearchController extends AbstractController
{
    public function __construct(
        private CarRepository $carRepository,
        private RentRepository $rentRepository,
        private CompanieRepository $companieRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(Request $request)
    {
        $dto = new CarSearch();
        $now = new DateTime('now - 1 second');
        $dto->startDate = $request->query->get('startDate', '');
        $dto->endDate = $request->query->get('endDate', '');
        $dto->location = $request->query->get('location', '');

        if (empty($dto->startDate) || empty($dto->endDate) || empty($dto->location)) {
            return new JsonResponse(['error' => 'Paramètres manquants'], Response::HTTP_BAD_REQUEST);
        }

        $startDate = DateTime::createFromFormat('d/m/Y', $dto->startDate);
        $endDate = DateTime::createFromFormat('d/m/Y', $dto->endDate);

        if ($startDate < $now || $endDate < $now || $startDate > $endDate) {
            return new JsonResponse(['error' => 'Date invalide'], Response::HTTP_BAD_REQUEST);
        }

        if ($startDate >= $endDate) {
            return new JsonResponse(['error' => 'La date de début doit être antérieure à la date de fin'], Response::HTTP_BAD_REQUEST);
        }

        if ($startDate < $now) {
            return new JsonResponse(['error' => 'La date de début doit être supérieure à la date actuelle'], Response::HTTP_BAD_REQUEST);
        }

        //filters
        $dto->energy = explode(',', $request->query->get('energy', ''));
        $dto->category = explode(',', $request->query->get('category', ''));
        $dto->brand = explode(',', $request->query->get('brand', ''));
        $dto->gear_type = explode(',', $request->query->get('gear_type', ''));
        $dto->nb_doors = $request->query->get('nb_doors', 0);
        $dto->nb_seats = $request->query->get('nb_seats', 0);
        $dto->price = $request->query->get('price', 0.0);
        $dto->horses = $request->query->get('horses', 0);
        $dto->mileage = $request->query->get('mileage', 0);
    
        $errors = $this->validator->validate($dto);
        
        if (count($errors) > 0) {
            return new JsonResponse(['error' => 'Données saisies invalides'], Response::HTTP_BAD_REQUEST);
        }
    
        $companies = $this->companieRepository->findBy(['city' => $dto->getLocation()]);
    
        if (empty($companies)) {
            return new JsonResponse(['error' => 'Aucune voiture disponible dans cette ville ou la ville saisie n\'est pas valide.'], Response::HTTP_BAD_REQUEST);
        }
    
        $availableCars = [];
    
        foreach ($companies as $company) {
            $companyId = $company->getId();
            $cars = $this->carRepository->findBy(['companie' => $companyId]);
    
            foreach ($cars as $car) {
                if ($this->filterCars($car, $dto)) {
                    $isAvailable = $this->isCarAvailable($car, $dto->getStartDate(), $dto->getEndDate());
    
                    if ($isAvailable->getStatusCode() === 200) {
                        $availableCars[] = $car;
                    }
                }
            }
        }
    
        if (empty($availableCars)) {
            return new JsonResponse(['error' => 'Aucune voiture disponible pour la période spécifiée'], Response::HTTP_NOT_FOUND);
        }
    
        return $this->json($availableCars, 200, [], ['groups' => ['car_search:read']]);
    }

    

    private function isCarAvailable(Car $car, $startDate, $endDate)
    {
        $startDate = DateTime::createFromFormat('d/m/Y', $startDate);
        $endDate = DateTime::createFromFormat('d/m/Y', $endDate);
    
        $rents = $this->rentRepository->findBy(['car' => $car]);
    
        if (!$rents) {
            return new JsonResponse(['success' => true], Response::HTTP_OK);
        }
    
        foreach ($rents as $rent) {
            $rentStart = $rent->getDateStart();
            $rentEnd = $rent->getDateEnd();
    
            if (($startDate >= $rentStart && $startDate <= $rentEnd) ||
                ($endDate >= $rentStart && $endDate <= $rentEnd) ||
                ($startDate <= $rentStart && $endDate >= $rentEnd) ||
                ($startDate >= $rentStart && $endDate <= $rentEnd) ||
                ($startDate <= $rentStart && $endDate >= $rentStart) ||
                ($startDate <= $rentEnd && $endDate >= $rentEnd)) {
                return new JsonResponse(['error' => 'Voiture indisponible pour la période spécifiée'], Response::HTTP_BAD_REQUEST);
            }
        }
    
        return new JsonResponse(['success' => true], Response::HTTP_OK);
    }
    
    

    public function filterCars(Car $car, CarSearch $filters): bool
    {
        $pass = true;

        if (!in_array($car->getCategory()->getLibelle(), $filters->getCategory()) && !empty(array_filter($filters->getCategory()))) {
            $pass = false;
        }
        
        if (!in_array($car->getEnergy()->getName(), $filters->getEnergy()) && !empty(array_filter($filters->getEnergy()))) {
            $pass = false;
        }

        if (!in_array($car->getModel()->getBrand()->getName(), $filters->getBrand()) && !empty(array_filter($filters->getBrand()))) {
            $pass = false;
        }

        if (!in_array($car->getGear()->getName(), $filters->getGearType()) && !empty(array_filter($filters->getGearType()))) {
            $pass = false;
        }

        if ($car->getNbDoors() < $filters->getNbDoors() && $filters->getNbDoors() !== 0) {
            $pass = false;
        }

        if ($car->getNbSeats() < $filters->getNbSeats() && $filters->getNbSeats() !== 0) {
            $pass = false;
        }

        if ($car->getPrice() > $filters->getPrice() && $filters->getPrice() !== 0.0) {
            $pass = false;
        }

        if ($car->getHorses() < $filters->getHorses() && $filters->getHorses() !== 0) {
            $pass = false;
        }

        if ($car->getMileage() > $filters->getMileage() && $filters->getMileage() !== 0) {
            $pass = false;
        }
    
        return $pass;
    }
}

