<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Energy;
use Zenstruck\Foundry\Test\ResetDatabase;

class EnergyTest extends ApiTestCase
{
    use ResetDatabase;
    public function testCreateEnergy(): void
    {
        $client = self::createClient();
        $client->request('POST', '/api/energies', [
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

}