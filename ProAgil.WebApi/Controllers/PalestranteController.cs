using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Repository;

namespace ProAgil.WebApi.Controllers
{
    
    public class PalestranteController : ControllerBase{
           private readonly IProAgilRepository _repo;
        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }

         // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get(string name)
        {
           try
           {
               var results = await  _repo.GetAllPalestrantesAsync(name,true);

               return Ok(results);         
           }
           catch (System.Exception)
           {
               return this.StatusCode(
                   StatusCodes.Status500InternalServerError,
                   "A conexão Com Banco de Dados Falhou!"
                   );   
           }
     
        }

    }
       
}