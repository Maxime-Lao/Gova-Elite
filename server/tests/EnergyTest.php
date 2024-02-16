<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Energy;
use Zenstruck\Foundry\Test\ResetDatabase;

class EnergyTest extends ApiTestCase
{
    use ResetDatabase;
    public function testGetAllEnergy(): void
    {
        $client = self::createClient();

        $client->request('GET', 'api/energies', [
            'headers' => [
                'Accept' => 'application/json+ld',
                'Content-Type' => 'application/json+ld',

            ],
        ]);

        $this->assertResponseIsSuccessful();

    }

}