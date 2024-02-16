<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Brand;
use Zenstruck\Foundry\Test\ResetDatabase;

class BrandTest extends ApiTestCase
{
    use ResetDatabase;
    public function testGetAllBrands(): void
    {
        $client = self::createClient();

        $client->request('GET', 'api/brands', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',

            ],
        ]);

        $this->assertResponseIsSuccessful();

    }

}