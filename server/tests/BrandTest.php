<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Brand;
use Zenstruck\Foundry\Test\ResetDatabase;

class BrandTest extends ApiTestCase
{
    use ResetDatabase;
    public function testCreateGear(): void
    {
        $client = self::createClient();
        $client->request('POST', '/api/brands', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',
            ],
            'json' => [
                'name' => 'Toyota',
                "createdAt" => "2024-02-16T00:05:17.614Z",
                "updatedAt" => "2024-02-16T00:05:17.614Z"
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

}