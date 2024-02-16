<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\ResetDatabase;

class CategoryTest extends ApiTestCase
{
    use ResetDatabase;
    public function testCreateCategory(): void
    {
        $client = self::createClient();
        $client->request('POST', '/api/categories', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',
            ],
            'json' => [
                'libelle' => 'test',
                "createdAt" => "2024-02-16T00:05:17.614Z",
                "updatedAt" => "2024-02-16T00:05:17.614Z"
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

}