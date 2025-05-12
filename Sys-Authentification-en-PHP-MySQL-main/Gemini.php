<?php
class Gemini {
    private $api_key = 'AIzaSyBM2F5aAbvfnwoavHqQ6GhQN4ff7imri_g'; // Clé API Gemini

    public function generate($prompt) {
   $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $this->api_key;




        $data = [
            'contents' => [[
                'parts' => [[
                    'text' => $prompt
                ]]
            ]]
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true, // 🔥 ajouté pour forcer un POST
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json']
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            return "Erreur CURL : " . curl_error($ch);
        }

        curl_close($ch);

        $result = json_decode($response, true);

        // 🔥 DEBUG si problème
        if (!isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            return "Erreur API Gemini : " . ($response ?? 'Réponse vide');
        }

        return $result['candidates'][0]['content']['parts'][0]['text'];
    }
}