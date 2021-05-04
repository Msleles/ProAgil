using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //GERAL
        void add<T > (T entity) where T: class;
        void Update< T > (T entity) where T: class;
        void Delete< T > (T entity) where T: class;
        Task<bool> SaveChangesAsync();

        //EVENTOS
        Task<Evento[]> GetAllEventosAsyncByTema(string tema , bool includePalestrantes);
        Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
        Task<Evento> GetAllEventosAsyncById(int EventoId,bool includePalestrantes);
        
        //PALESTRANTE
         Task<Palestrante[]> GetAllPalestrantesAsync(string name, bool includeEventos);
        Task<Palestrante> GetAllPalestranteAsyncById(int PalestranteId , bool includeEventos);

       
    }
}