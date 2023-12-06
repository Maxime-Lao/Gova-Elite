<?php

namespace App\Controller;

use App\Entity\Car;
use App\Repository\CarRepository;
use App\Repository\RentRepository;
use App\Repository\CompanieRepository;
use App\Dto\CarSearch;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
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
        // Create a new CarSearch object and populate it with query parameters
        $dto = new CarSearch();
        $dto->startDate = $request->query->get('startDate', '');
        $dto->endDate = $request->query->get('endDate', '');
        $dto->location = $request->query->get('location', '');
    
        // Validate the DTO
        $errors = $this->validator->validate($dto);
    
        if (count($errors) > 0) {
            return $this->json(['error' => 'Validation failed', 'details' => $errors], 400);
        }
    
        // Retrieve all companies based on the provided location
        $companies = $this->companieRepository->findBy(['city' => $dto->getLocation()]);
    
        if (empty($companies)) {
            return $this->json(['error' => 'No companies found for the provided location'], 404);
        }
    
        // Create an empty array to store the available cars
        $availableCars = [];
    
        // Iterate through each company
        foreach ($companies as $company) {
            // Retrieve the company ID
            $companyId = $company->getId();
    
            // Retrieve all cars for the given company
            $cars = $this->carRepository->findBy(['companie' => $companyId]);
    
            // Check if the car is available for the given date range
            foreach ($cars as $car) {
                if ($this->isCarAvailable($car, $dto->getStartDate(), $dto->getEndDate())) {
                    $availableCars[] = $car;
                }
            }
        }
    
        // Return the available cars
        return $this->json($availableCars, 200, [], ['groups' => ['car_search:read']]);
    }

    private function isCarAvailable(Car $car, $startDate, $endDate) : bool
    {
        //format the date
        $startDate = DateTime::createFromFormat('d/m/Y', $startDate);
        $endDate = DateTime::createFromFormat('d/m/Y', $endDate);
        // Retrieve all rents for the given car
        $rents = $this->rentRepository->findBy(['car' => $car]);
    
        if (!$rents) {
            return true;
        }

        foreach ($rents as $rent) {
            // Check if the start date is between the start and end date of the rent
            if ($startDate >= $rent->getDateStart() && $startDate <= $rent->getDateEnd()) {
                return false;
            }

            // Check if the end date is between the start and end date of the rent
            if ($endDate >= $rent->getDateStart() && $endDate <= $rent->getDateEnd()) {
                return false;
            }

            // Check if the start and end date are before the start date of the rent
            if ($startDate <= $rent->getDateStart() && $endDate >= $rent->getDateEnd()) {
                return false;
            }

            // Check if the start and end date are after the end date of the rent
            if ($startDate >= $rent->getDateStart() && $endDate <= $rent->getDateEnd()) {
                return false;
            }

            // Check if the start date is before the start date of the rent and the end date is after the start date of the rent
            if ($startDate <= $rent->getDateStart() && $endDate >= $rent->getDateStart()) {
                return false;
            }

            // Check if the start date is before the end date of the rent and the end date is after the end date of the rent
            if ($startDate <= $rent->getDateEnd() && $endDate >= $rent->getDateEnd()) {
                return false;
            }
        }

        return true;
    }
}

