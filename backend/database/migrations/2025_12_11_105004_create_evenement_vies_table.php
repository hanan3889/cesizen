<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evenement_vies', function (Blueprint $table) {
            $table->id();
            $table->string('type_evenement')->unique();
            $table->unsignedInteger('points');
            $table->timestamps();
            
            // Index sur les points pour les calculs de score
            $table->index('points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenement_vies');
    }
};
