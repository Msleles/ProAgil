using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;
using ProAgil.Repository.Data;
using System.Linq;

namespace ProAgil.Repository
{
  public class ProAgilRepository : IProAgilRepository
  {

     private readonly ProAgilContext _context;
      public ProAgilRepository(ProAgilContext context)
      {
          _context = context;
          _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
      }

      //GERAIS
    public void add<T>(T entity) where T : class
    {
      _context.Add(entity);
    }

     public void Update<T>(T entity) where T : class
    {
       _context.Update(entity);
    }

     public void Delete<T>(T entity) where T : class
    {
      _context.Remove(entity);
    }
    
    public async Task<bool> SaveChangesAsync()
    {
     return  (await _context.SaveChangesAsync()) > 0;
    }


    public async  Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
    {
      IQueryable<Evento> query = _context.Eventos
      .Include(c => c.Lote)
      .Include(c => c.RedesSociais);
     
     if (includePalestrantes)
     {
         query = query
         .Include(pe => pe.PalestranteEventos)
         .ThenInclude(p => p.Palestrante);
     }
         query = query.AsNoTracking()
         .OrderByDescending(c=> c.DataEvento);

         return await query.ToArrayAsync();

    }

     public async Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes)
    {
     IQueryable<Evento> query = _context.Eventos
      .Include(c => c.Lote)
      .Include(c => c.RedesSociais);
     
     if (includePalestrantes)
     {
         query = query
         .Include(pe => pe.PalestranteEventos)
         .ThenInclude(p => p.Palestrante);
     }
         query = query.AsNoTracking()
         .OrderByDescending(c=> c.DataEvento)
         .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

         return await query.ToArrayAsync();

    }

    public async Task<Evento> GetAllEventosAsyncById(int EventoId, bool includePalestrantes)
    {
       IQueryable<Evento> query = _context.Eventos
      .Include(c => c.Lote)
      .Include(c => c.RedesSociais);
     
     if (includePalestrantes)
     {
         query = query
         .Include(pe => pe.PalestranteEventos)
         .ThenInclude(p => p.Palestrante);
     }
         query = query.AsNoTracking()
         .OrderByDescending(c=> c.DataEvento)
         .Where(c => c.Id == (EventoId));

         return await query.FirstOrDefaultAsync();
    }

   
    public async Task<Palestrante> GetAllPalestranteAsyncById(int PalestranteId, bool includeEventos = false)
    {
      IQueryable<Palestrante> query = _context.Palestrantes
    
      .Include(c => c.RedesSociais);
     
     if (includeEventos)
     {
         query = query
         .Include(pe => pe.PalestrantesEventos)
         .ThenInclude(e => e.Evento);
     }
         query = query.AsNoTracking()
         .OrderBy(p=> p.Nome)
         .Where(p => p.Id == PalestranteId);

         return await query.FirstOrDefaultAsync();
    }


    public async Task<Palestrante[]> GetAllPalestrantesAsync(string name ,bool includeEventos)
    {
       IQueryable<Palestrante> query = _context.Palestrantes
    
      .Include(c => c.RedesSociais);
     
     if (includeEventos)
     {
         query = query
         .Include(pe => pe.PalestrantesEventos)
         .ThenInclude(e => e.Evento);
     }
         query = query.AsNoTracking().Where (p => p.Nome.ToLower().Contains(name.ToLower()));
    

         return await query.ToArrayAsync();
    }

  }
}