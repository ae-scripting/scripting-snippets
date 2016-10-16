//expressions function
//returns type of a layer
//does not see a difference between null, solid, image and adjustmnt layer

function getLayerType(layer)
	{
		try
			{
				var src = layer.source;
				if(src.toString() == "[object Comp]")
					return "Comp";
				else 
					if(!layer.hasVideo && layer.hasAudio)
						return "Audio";
					else 
						if(src.frameDuration == 0)
							return "Image or Solid";
						else
							try
								{
									layer("ADBE Effect Parade")("CINEMA 4D Effect");
									return "Cinema 4D File"
								}
							catch(e)
								{
									return "Video";
								}
			}
		catch(e)//no source
			{
				try
					{
						layer("ADBE Text Properties");
						return "Text";
					}
				catch(e)//not text
					{
						try
							{
								layer("ADBE Light Options Group");
								return "Light";		
							}
						catch(e)//not light
							{
								try
									{
										layer("ADBE Camera Options Group");
										return "Camera";
									}
								catch(e)
									{
										try
											{
												layer("ADBE Root Vectors Group");
												return "Shape";
											}
										catch(e)
											{return "Unknown";}
									}
							}
					}
			}
	}