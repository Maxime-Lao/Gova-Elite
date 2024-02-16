<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\ResetDatabase;

class CategoryTest extends ApiTestCase
{
    use ResetDatabase;
    public function testGetAllCategory(): void
    {
        $client = self::createClient();

        $client->request('GET', 'api/categories', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',

            ],
        ]);

        $this->assertResponseIsSuccessful();

    }

}