import { Controller, Get, Post } from '@nestjs/common';
import { Client } from "pg";

type Film = {
    film_id: number,
    title: string,
    description: string,
    release_year: number,
    language: string,
    rental_duration: number,
    rental_rate: number,
    rating: number,
    actors?: Array<Actor> | Array <void>

}
type Actor = {
    film_id?: number,
    first_name: string,
    last_name: string
}

function getClient() {
    return new Client({
        host: "localhost",
        port: 5432,
        database: "dvdrental",
        user: "postgres",
        password: "testing"

    })
}

@Controller('films')
export class FilmsController {

    @Get()
    async listFilms(): Promise<Array<Film>> {
        const client = getClient();
        await client.connect()
        const film_rows: Array<Film> = await client.query("select film_id, title, description, release_year, name as language, rental_duration, rental_rate, rating from film inner join language using(language_id);")
        .then((res) => {return res.rows})
        .catch((err) => {console.error(err.stack); return []})
        const actor_rows: Array<Actor> = await client.query("select film_id, first_name, last_name from film inner join film_actor using(film_id) inner join actor using(actor_id)").then((res) => res.rows)
        for (let film_row of film_rows) {
            film_row.actors  = actor_rows.filter((actor) => actor.film_id === film_row.film_id).map((actor) => {
                return {
                    first_name: actor.first_name, 
                    last_name: actor.last_name
            }});
        

            
        }
        
        return film_rows;
    }

    @Post('/pay')
    async payFilm() {
        
    }

}
