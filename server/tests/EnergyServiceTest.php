<?php

namespace App\Tests;

use App\Entity\Energy;
use App\Repository\EnergyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class EnergyServiceTest extends KernelTestCase
{
        /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var EnergyRepository
     */
    private $energyRepository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
        $this->energyRepository= $this->entityManager->getRepository(Energy::class);
    }

    public function testFindAllEnergy(): void
    {
        $energies = $this->energyRepository->findAll();
        $this->assertCount(0, $energies);
    }

    public function testFindByEnergy(): void
    {
        $energy = $this->energyRepository->findOneBy(['name' => 'test']);
        $this->assertNull($energy);
    }
}

