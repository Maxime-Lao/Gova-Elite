<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;

class PaymentController extends AbstractController
{
    #[Route('/create-payment-intent', name: 'create_payment_intent', methods: ['POST'])]
    public function createPaymentIntent(Request $request): Response
    {
        \Stripe\Stripe::setApiKey($_ENV['STRIPE_API_SECRET']);

        $data = json_decode($request->getContent(), true);

        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $data['amount'] * 100,
                'currency' => 'eur',
                'payment_method' => $data['paymentMethodId'],
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => 'http://localhost:3000/',
            ]);
            
            return $this->json(['success' => true, 'paymentIntent' => $paymentIntent]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('/update-payment-intent', name: 'update_payment_intent', methods: ['POST'])]
public function updatePaymentIntent(Request $request): Response
{
    \Stripe\Stripe::setApiKey($_ENV['STRIPE_API_SECRET']);
    $data = json_decode($request->getContent(), true);
    $originalPaymentIntentId = $data['originalPaymentIntentId'];
    $newAmount = $data['newAmount'] * 100;

    try {
        // Exemple de remboursement de l'intent de paiement original
        // Ceci est optionnel et dépend de votre logique métier
        $refund = \Stripe\Refund::create([
            'payment_intent' => $originalPaymentIntentId,
        ]);

        // Création d'un nouvel intent de paiement pour le nouveau montant
        $newPaymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $newAmount,
            'currency' => 'eur',
            'payment_method' => $data['paymentMethodId'],
            'confirmation_method' => 'manual',
            'confirm' => true,
            'return_url' => 'http://localhost:3000/',
        ]);
        
        return $this->json(['success' => true, 'newPaymentIntent' => $newPaymentIntent]);
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 400);
    }
}
}
