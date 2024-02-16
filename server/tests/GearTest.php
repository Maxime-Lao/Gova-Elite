<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Gear;
use Zenstruck\Foundry\Test\ResetDatabase;

class GearTest extends ApiTestCase
{
    use ResetDatabase;

    public function testGetAllGear(): void
    {
        $client = self::createClient();

        $client->request('GET', 'api/gears', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',

            ],
        ]);

        $this->assertResponseIsSuccessful();

    }
}