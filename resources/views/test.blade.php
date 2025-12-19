<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test TailwindCSS - CesiZen</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-cesizen-green mb-4">
                🎉 TailwindCSS fonctionne !
            </h1>
            
            <div class="card mb-6">
                <h2 class="text-2xl font-semibold mb-4">Test des composants CesiZen</h2>
                
                <div class="space-y-4">
                    <button class="btn-primary">
                        Bouton Principal
                    </button>
                    
                    <button class="btn-secondary">
                        Bouton Secondaire
                    </button>
                    
                    <button class="btn-outline">
                        Bouton Outline
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="card">
                    <h3 class="text-xl font-semibold text-cesizen-green mb-2">Card 1</h3>
                    <p class="text-gray-600">Exemple de card avec style CesiZen</p>
                </div>
                
                <div class="card">
                    <h3 class="text-xl font-semibold text-cesizen-green mb-2">Card 2</h3>
                    <p class="text-gray-600">Avec hover effet</p>
                </div>
                
                <div class="card">
                    <h3 class="text-xl font-semibold text-cesizen-green mb-2">Card 3</h3>
                    <p class="text-gray-600">Et shadow animation</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>