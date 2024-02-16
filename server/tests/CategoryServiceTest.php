<?php

namespace App\Tests;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CategoryServiceTest extends KernelTestCase
{
        /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var CategoryRepository
     */
    private $categoryRepository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
        $this->categoryRepository= $this->entityManager->getRepository(Category::class);
    }

    public function testFindAllCategory(): void
    {
        $categories = $this->categoryRepository->findAll();
        $this->assertCount(0, $categories);
    }

    public function testFindByCategory(): void
    {
        $category = $this->categoryRepository->findOneBy(['libelle' => 'test']);
        $this->assertNull($category);
    }
}

