<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Gear;
use Zenstruck\Foundry\Test\ResetDatabase;

class GearTest extends ApiTestCase
{
    use ResetDatabase;
    public function testCreateGear(): void
    {
        $client = self::createClient();
        $client->request('POST', '/api/gears', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',
            ],
            'json' => [
                'name' => 'test',
                "createdAt" => "2024-02-16T00:05:17.614Z",
                "updatedAt" => "2024-02-16T00:05:17.614Z"
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testPatchGear(): void
    {
        $client = self::createClient();
        

        $client->request('PATCH', '/api/gears/1', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/merge-patch+json',
            ],
            'json' => [
                'name' => 'test2',
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }
}