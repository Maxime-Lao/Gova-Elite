<?php

namespace App\Tests;

use App\Entity\Gear;
use App\Repository\GearRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class GearServiceTest extends KernelTestCase
{
        /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var GearRepository
     */
    private $gearRepository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
        $this->gearRepository = $this->entityManager->getRepository(Gear::class);
    }

    public function testFindAllGear(): void
    {
        $gears = $this->gearRepository->findAll();
        $this->assertCount(0, $gears);
    }

    public function testFindByGear(): void
    {
        $gear = $this->gearRepository->findOneBy(['name' => 'test']);
        $this->assertNull($gear);
    }
}

